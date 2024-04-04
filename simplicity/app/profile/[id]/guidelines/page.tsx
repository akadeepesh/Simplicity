import React from "react";

const GuideLines = () => {
  return (
    <div className="container max-w-full flex flex-col mt-14 md:mt-28">
      <h1 className="text-3xl font-bold mb-4">Community Guidelines</h1>
      <p className="mb-4">
        Welcome to our community! We're committed to maintaining a safe and
        respectful environment for everyone. Here are some guidelines to help
        you understand what is expected of you and what you can expect from
        other participants.
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li className="mb-2">
          <strong>Respect others.</strong> Treat all members with kindness and
          understanding. We're all here to learn and grow together.
        </li>
        <li className="mb-2">
          <strong>Stay on topic.</strong> Make sure your contributions are
          relevant to the discussion and to the purpose of the forum.
        </li>
        <li className="mb-2">
          <strong>No spam.</strong> Don't post the same poetry multiple times or
          post promotional material.
        </li>
        <li className="mb-2">
          <strong>No offensive content.</strong> Avoid posting anything that's
          offensive, hateful, or violent. Be mindful of the words you choose and
          how they might be perceived by others.
        </li>
        <li className="mb-2">
          <strong>Plagiarism.</strong> Any form of plagiarism is strictly
          prohibited. Always give credit to the original source or author and do
          not present someone else's work as your own. Violations can result in
          penalties ranging from warnings to permanent bans.
        </li>
        <li className="mb-2">
          <strong>Respect privacy.</strong> Don't share personal information
          about yourself or others, including addresses, phone numbers, or email
          addresses.
        </li>
        <li className="mb-2">
          <strong>Report violations.</strong> If you see something that violates
          these guidelines, report it to the moderators. We rely on our
          community members to help keep the conversation respectful and in line
          with our guidelines.
        </li>
        <li className="mb-2">
          <strong>False Reporting.</strong> Submitting false reports or
          repeatedly reporting content without a valid reason is not allowed.
          Users found to be submitting false reports may face temporary or
          permanent bans from the community.
        </li>
        <li className="mb-2">
          <strong>Cooperation with Moderation.</strong> If a moderator contacts
          you regarding a violation of these guidelines, please cooperate with
          them. Failure to cooperate with moderation actions can result in
          further penalties.
        </li>
        <li className="mb-2">
          <strong>Penalties for Violations.</strong> Violations of these
          guidelines can result in penalties ranging from warnings to permanent
          bans, depending on the severity and frequency of the violations.
        </li>
        <li className="mb-2">
          <strong>Respect Decisions.</strong> Please respect the decisions of
          the moderators. If you have a question about a moderation action, you
          can contact the moderation team directly.
        </li>
        <li className="mb-2">
          <strong>Changes to Guidelines.</strong> These guidelines are subject
          to change, and we will notify users of any major changes. Continued
          use of the community after changes to the guidelines constitutes
          acceptance of the changes.
        </li>
      </ul>
    </div>
  );
};

export default GuideLines;
