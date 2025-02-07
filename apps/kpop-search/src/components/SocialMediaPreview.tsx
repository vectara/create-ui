import React from 'react';
import {
  VuiCard,
  VuiFlexContainer,
  VuiFlexItem,
  VuiIcon,
  VuiText,
  VuiLink
} from '../ui';
import { SocialMediaSource } from '../types/social-media';
import { BiLogoTwitter, BiLogoInstagram, BiLogoYoutube } from 'react-icons/bi';

interface Props {
  source: SocialMediaSource;
}

const PlatformIcon: React.FC<{ platform: SocialMediaSource['platform'] }> = ({ platform }) => {
  switch (platform) {
    case 'twitter':
      return <BiLogoTwitter />;
    case 'instagram':
      return <BiLogoInstagram />;
    case 'youtube':
      return <BiLogoYoutube />;
  }
};

export const SocialMediaPreview: React.FC<Props> = ({ source }) => {
  const { platform, username, content, url, timestamp } = source;
  const date = new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <VuiCard
      padding="m"
      body={
        <>
          <VuiFlexContainer alignItems="center" spacing="s">
            <VuiFlexItem grow={false}>
              <VuiIcon color="primary">
                <PlatformIcon platform={platform} />
              </VuiIcon>
            </VuiFlexItem>

            <VuiFlexItem grow={false}>
              <VuiLink href={url} target="_blank">@{username}</VuiLink>
            </VuiFlexItem>

            <VuiFlexItem grow={false}>
              <VuiText size="s">
                {date}
              </VuiText>
            </VuiFlexItem>
          </VuiFlexContainer>

          <VuiFlexContainer spacing="s">
            <VuiFlexItem>
              <VuiText>
                {content}
              </VuiText>
            </VuiFlexItem>
          </VuiFlexContainer>
        </>
      }
    />
  );
};
